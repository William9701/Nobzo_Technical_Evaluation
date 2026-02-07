import { Response, NextFunction } from 'express';
import Post from '../models/Post';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, status, tags } = req.body;

    const post = await Post.create({
      title,
      content,
      status: status || 'draft',
      tags: tags || [],
      author: req.user?._id,
    });

    await post.populate('author', 'name email');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { deletedAt: null };

    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    // Filter by status
    if (req.query.status) {
      // Only authenticated users can filter by status
      if (!req.user) {
        return next(new AppError('Authentication required to filter by status', 401));
      }
      // Users can only see their own drafts
      if (req.query.status === 'draft') {
        query.status = 'draft';
        query.author = req.user._id;
      } else {
        query.status = req.query.status;
      }
    } else {
      // Public users only see published posts
      if (!req.user) {
        query.status = 'published';
      } else {
        // Authenticated users see published posts and their own drafts
        query.$or = [
          { status: 'published' },
          { status: 'draft', author: req.user._id },
        ];
      }
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const query: any = { slug, deletedAt: null };

    // Only published posts are accessible by slug, unless it's the author
    const post = await Post.findOne(query).populate('author', 'name email');

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if post is draft and user is not the author
    if (post.status === 'draft') {
      if (!req.user || post.author._id.toString() !== req.user._id.toString()) {
        return next(new AppError('Post not found', 404));
      }
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, status, tags } = req.body;

    const post = await Post.findOne({ _id: id, deletedAt: null });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if user is the author
    if (post.author.toString() !== req.user?._id.toString()) {
      return next(new AppError('Not authorized to update this post', 403));
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (status) post.status = status;
    if (tags) post.tags = tags;

    await post.save();
    await post.populate('author', 'name email');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({ _id: id, deletedAt: null });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Check if user is the author
    if (post.author.toString() !== req.user?._id.toString()) {
      return next(new AppError('Not authorized to delete this post', 403));
    }

    // Soft delete
    post.deletedAt = new Date();
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
