import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import SalinTempel from '../model/salinTempel';
import { validationResult } from 'express-validator';
import Tag from '../model/tag';

export const createSalinTempel = async (req: Request, res: Response) => {
  try {
    // check for validation errors
    const errors = validationResult(req);

    // check in body tags if one of the element tag not exist in database
    const tags = await Tag.find();
    const tagsName = tags.map((tag) => tag.name);
    const newTags = req.body.tags.filter(
      (tag: string) => !tagsName.includes(tag),
    );
    // add new tags to database
    const newTagsAdded = await Tag.insertMany(
      newTags.map((tag: string) => ({ name: tag })),
    );

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        end_point: req.originalUrl,
        method: req.method,
        message: 'Failed to create salin tempel.',
        errors: errors.array().map((error) => error.msg),
      });
    }

    const result = await SalinTempel.create(req.body);

    res.status(201).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to create salin tempel.',
    });
  }
};
interface SortOptions {
  [key: string]: SortOrder;
}

export const getSalinTempels = async (req: Request, res: Response) => {
  // destructuring query params and set default value
  const { offset = 0, limit = 10, sort = 'new', type = '' } = req.query;
  try {
    const sortOptions: SortOptions = {
      totalLikes: type === 'popular' ? -1 : 1,
      createdAt: sort === 'new' ? -1 : 1,
    };

    // execute query with offset and limit values
    const results = await SalinTempel.find()
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortOptions)
      .exec();

    // get total documents in the SalinTempel collection
    const count = await SalinTempel.countDocuments();

    // return response with salin tempels, total count, and offset and limit values
    res.status(200).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: results,
      next:
        count > Number(offset) + Number(limit)
          ? `${req.protocol}://${req.get('host')}${req.originalUrl
              .split('?')
              .shift()}?offset=${Number(offset) + Number(limit)}&limit=${limit}`
          : null,
      previous:
        Number(offset) - Number(limit) >= 0
          ? `${req.protocol}://${req.get('host')}${req.originalUrl
              .split('?')
              .shift()}?offset=${Number(offset) - Number(limit)}&limit=${limit}`
          : null,
      count,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to get salin tempels.',
    });
  }
};

export const getSalinTempelById = async (req: Request, res: Response) => {
  try {
    const result = await SalinTempel.findById(req.params.id);
    if (!result) {
      return res.status(404).json({
        status: 'fail',
        end_point: req.originalUrl,
        method: req.method,
        message: 'Salin tempel not found.',
      });
    }
    res.status(200).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to get salin tempel.',
    });
  }
};

export const updateSalinTempelById = async (req: Request, res: Response) => {
  try {
    // check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        end_point: req.originalUrl,
        method: req.method,
        message: 'Failed to update salin tempel.',
        errors: errors.array().map((error) => error.msg),
      });
    }

    const result = await SalinTempel.findByIdAndUpdate(req.params.id, req.body)
      .lean()
      .exec();

    if (!result) {
      return res.status(404).json({
        status: 'fail',
        end_point: req.originalUrl,
        method: req.method,
        message: 'Salin tempel not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to update salin tempel.',
    });
  }
};

export const getRandomSalinTempel = async (req: Request, res: Response) => {
  const results = await SalinTempel.find();
  const random = Math.floor(Math.random() * results.length);
  res.status(200).json({
    status: 'success',
    end_point: req.originalUrl,
    method: req.method,
    data: results[random],
  });
};

export const deleteSalinTempel = async (req: Request, res: Response) => {
  try {
    const result = await SalinTempel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to delete salin tempel.',
    });
  }
};

export const likeSalinTempel = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const salinTempel = await SalinTempel.findById(id);
    if (!salinTempel) {
      return res.status(404).json({
        status: 'fail',
        end_point: req.originalUrl,
        method: req.method,
        message: 'Salin tempel not found.',
      });
    }

    const isLiked = salinTempel.likesBy.includes(userId);

    const result = await SalinTempel.findByIdAndUpdate(
      id,
      {
        likesBy: isLiked
          ? salinTempel.likesBy.filter((like) => like !== userId)
          : [...salinTempel.likesBy, userId],
        totalLikes: isLiked
          ? salinTempel.totalLikes - 1
          : salinTempel.totalLikes + 1,
      },
      { new: true },
    );

    res.status(200).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to like salin tempel.',
    });
  }
};

export const getMyFavoriteSalinTempels = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const result = await SalinTempel.find({ likesBy: { $in: [userId] } });
    const results = result.filter((salinTempel) =>
      salinTempel.likesBy.includes(userId),
    );
    res.status(200).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to get my favorite salin tempels.',
    });
  }
};

export const getMySalinTempels = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await SalinTempel.find({ author: userId })
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json({
      status: 'success',
      end_point: req.originalUrl,
      method: req.method,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      end_point: req.originalUrl,
      method: req.method,
      message: 'Failed to get my salin tempels.',
    });
  }
};
