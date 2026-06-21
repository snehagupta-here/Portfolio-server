import { Injectable, BadGatewayException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  InvalidUserSkillIdException,
  InvalidUserIdException,
  UserNotFoundException,
  UserResumeDownloadFailedException,
  UserResumeNotFoundException,
  UserSearchQueryRequiredException,
  UserSkillNotFoundException,
} from 'src/exceptions/user.exceptions';
import { UserUpdate } from 'src/interfaces';
import { Skill } from 'src/schema/skill.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { handleError } from 'src/utils/error-handler';
import { GithubCache, GithubCacheDocument } from 'src/schema/github.schema';
interface DownloadedResume {
  buffer: Buffer;
  contentType: string;
  fileName: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userCollection: Model<UserDocument>,
    @InjectModel(Skill.name)
    private readonly skillCollection: Model<Skill>,
    @InjectModel(GithubCache.name)
    private readonly githubCacheModel: Model<GithubCacheDocument>,
    private readonly configService: ConfigService,
  ) { }

  async getAllUsers() {
    try {
      const users = await this.userCollection
        .find()
        .populate('skills.skill_id')
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: users,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch users');
    }
  }

  async getUserById(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const user = await this.userCollection
        .findById(id)
        .populate('skills.skill_id');

      if (!user) {
        throw new UserNotFoundException();
      }

      return {
        success: true,
        data: user,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to fetch user');
    }
  }

  async searchUsers(query: { name?: string; skill_id?: string }) {
    try {
      const name = query.name?.trim();
      const skillId = query.skill_id?.trim();

      if (!name && !skillId) {
        throw new UserSearchQueryRequiredException();
      }

      const filters: Record<string, unknown> = {};

      if (name) {
        filters.name = {
          $regex: this.escapeRegex(name),
          $options: 'i',
        };
      }

      if (skillId) {
        if (!Types.ObjectId.isValid(skillId)) {
          throw new InvalidUserSkillIdException();
        }

        filters['skills.skill_id'] = new Types.ObjectId(skillId);
      }

      const users = await this.userCollection
        .find(filters)
        .populate('skills.skill_id')
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: users,
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to search users');
    }
  }

  async downloadResume(id: string): Promise<DownloadedResume> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const user = await this.userCollection.findById(id).select('name resume');

      if (!user) {
        throw new UserNotFoundException();
      }

      const resumeUrl = user.resume?.secureUrl ?? user.resume?.url;
      if (!resumeUrl) {
        throw new UserResumeNotFoundException();
      }

      const resumeResponse = await fetch(resumeUrl);
      if (!resumeResponse.ok) {
        throw new UserResumeDownloadFailedException();
      }

      const arrayBuffer = await resumeResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType =
        resumeResponse.headers.get('content-type') ?? 'application/octet-stream';

      return {
        buffer,
        contentType,
        fileName: this.resolveResumeFileName(user),
      };
    } catch (e: unknown) {
      return handleError(e, 'Failed to download resume');
    }
  }

  async updateUser(id: string, body: UserUpdate) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const user = await this.userCollection.findById(id);

      if (!user) {
        throw new UserNotFoundException();
      }

      if (body.name !== undefined) {
        user.name = body.name;
      }

      if (body.title !== undefined) {
        user.title = body.title;
      }

      if (body.tagline !== undefined) {
        user.tagline = body.tagline;
      }

      if (body.bio !== undefined) {
        user.bio = body.bio;
      }

      if (body.email !== undefined) {
        user.email = body.email.trim() || undefined;
      }

      if (body.avatar !== undefined) {
        user.avatar = body.avatar;
      }

      if (body.aboutHeading !== undefined) {
        user.aboutHeading = body.aboutHeading;
      }

      if (body.aboutBio !== undefined) {
        user.aboutBio = body.aboutBio;
      }

      if (body.totalYearsExperience !== undefined) {
        user.totalYearsExperience = body.totalYearsExperience;
      }

      if (body.projectsCompleted !== undefined) {
        user.projectsCompleted = body.projectsCompleted;
      }

      if (body.location !== undefined) {
        user.location = body.location;
      }

      if (body.paragraphs !== undefined) {
        user.paragraphs = body.paragraphs;
      }

      if (body.highlights !== undefined) {
        user.highlights = this.resolveHighlights(body.highlights);
      }

      if (body.socialLinks !== undefined) {
        user.socialLinks = this.resolveSocialLinks(body.socialLinks);
      }

      if (body.skills !== undefined) {
        user.skills = await this.resolveSkills(body.skills);
      }

      if (body.resume !== undefined) {
        user.resume = body.resume;
      }

      await user.save();

      return {
        success: true,
        data: user,
        message: 'User updated successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to update user');
    }
  }

  async deleteUser(id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new InvalidUserIdException();
      }

      const deleted = await this.userCollection.findByIdAndDelete(id);

      if (!deleted) {
        throw new UserNotFoundException();
      }

      return {
        success: true,
        message: 'User deleted successfully.',
      };
    } catch (e: unknown) {
      handleError(e, 'Failed to delete user');
    }
  }

  private resolveSocialLinks(
    links: NonNullable<UserUpdate['socialLinks']>,
  ): UserDocument['socialLinks'] {
    return links.map((link) => ({
      id: link.id,
      name: link.name,
      icon: link.icon,
      url: link.url,
    }));
  }

  private resolveHighlights(
    highlights: NonNullable<UserUpdate['highlights']>,
  ): UserDocument['highlights'] {
    return highlights.map((highlight) => ({
      id: highlight.id,
      title: highlight.title,
      description: highlight.description,
    }));
  }

  private async resolveSkills(
    skills: NonNullable<UserUpdate['skills']>,
  ): Promise<UserDocument['skills']> {
    for (const skill of skills) {
      if (!Types.ObjectId.isValid(skill.skill_id)) {
        throw new InvalidUserSkillIdException();
      }
    }

    const uniqueSkillIds = [...new Set(skills.map((skill) => skill.skill_id))];

    if (uniqueSkillIds.length > 0) {
      const existingSkills = await this.skillCollection.countDocuments({
        _id: {
          $in: uniqueSkillIds.map((skillId) => new Types.ObjectId(skillId)),
        },
      });

      if (existingSkills !== uniqueSkillIds.length) {
        throw new UserSkillNotFoundException();
      }
    }

    return skills.map((skill) => ({
      skill_id: new Types.ObjectId(skill.skill_id),
      yoe: skill.yoe,
      scale: skill.scale,
    }));
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private resolveResumeFileName(user: UserDocument): string {
    const fileName =
      user.resume?.fileName ??
      user.resume?.originalFilename ??
      this.fileNameFromUrl(user.resume?.secureUrl ?? user.resume?.url) ??
      `${user.name || 'resume'}-resume`;

    return this.sanitizeDownloadFileName(fileName);
  }

  private fileNameFromUrl(url?: string): string | undefined {
    if (!url) {
      return undefined;
    }

    try {
      const pathname = new URL(url).pathname;
      const fileName = pathname.split('/').filter(Boolean).pop();

      return fileName ? decodeURIComponent(fileName) : undefined;
    } catch {
      return undefined;
    }
  }

  private sanitizeDownloadFileName(fileName: string): string {
    const sanitized = fileName
      .trim()
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/[\r\n]+/g, '')
      .replace(/\s+/g, ' ');

    return sanitized || 'resume';
  }

  async getContributions(year: number) {
    const token = this.configService.getOrThrow<string>('GITHUB_TOKEN');
    const cacheKey = `github-contributions:${year}`;
    const cached = await this.githubCacheModel.findOne({
      key: cacheKey,
      expiresAt: { $gt: new Date() },
    });

    if (cached) {
      console.log('Returning GitHub contributions from DB cache:', cacheKey);
      return cached.data;
    }

    const from = `${year}-01-01T00:00:00Z`;
    const to = `${year}-12-31T23:59:59Z`;

    const query = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
        login
        contributionsCollection(from: $from, to: $to) {
          totalPullRequestContributions
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
                weekday
              }
            }
          }
        }
      }
    }
  `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          from,
          to,
        },
      }),
    });

    const data = await response.json();

    console.log('GitHub status:', response.status);
    console.log('GitHub data:', JSON.stringify(data, null, 2));

    if (!response.ok || data.errors) {
      console.error('GitHub API error:', data.errors ?? data);
      throw new BadGatewayException('Failed to fetch GitHub contributions');
    }

    const viewer = data.data.viewer;
    const collection = viewer.contributionsCollection;
    const calendar = collection.contributionCalendar;

    const days = calendar.weeks.flatMap((week) => week.contributionDays);

    console.log('GitHub viewer:', viewer.login);
    console.log('Calendar total:', calendar.totalContributions);
    console.log('PR total:', collection.totalPullRequestContributions);
    console.log('Restricted:', collection.restrictedContributionsCount);

    console.table(
      days
        .filter((day) => day.contributionCount > 0)
        .map((day) => ({
          date: day.date,
          count: day.contributionCount,
          color: day.color,
        })),
    );
    const SIX_HOURS_IN_MS = 1000 * 60 * 60 * 6;
    const result = {
      year,
      username: viewer.login,
      totalContributions: calendar.totalContributions,
      pullRequestContributions: collection.totalPullRequestContributions,
      restrictedContributions: collection.restrictedContributionsCount,
      activeDays: days.filter((day) => day.contributionCount > 0).length,
      longestStreak: this.calculateLongestStreak(days),
      currentStreak: this.calculateCurrentStreak(days),
      weeks: calendar.weeks,
    };
    await this.githubCacheModel.findOneAndUpdate(
      { key: cacheKey },
      {
        key: cacheKey,
        data: result,
        expiresAt: new Date(Date.now() + SIX_HOURS_IN_MS),
      },
      {
        upsert: true,
        new: true,
      },
    );
    return result;
  }

  private calculateLongestStreak(days: any[]) {
    let longest = 0;
    let current = 0;

    for (const day of days) {
      if (day.contributionCount > 0) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }

    return longest;
  }
  private calculateCurrentStreak(days: any[]) {
    let streak = 0;

    const sortedDays = [...days].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    for (const day of sortedDays) {
      if (day.contributionCount > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
