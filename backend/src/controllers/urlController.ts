import { Request, Response } from 'express';
import Url from '../models/url';
import { nanoid } from 'nanoid';

export const createUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) {
      res.status(400).json({ message: 'longUrl is required' });
      return;
    }

    let shortId = '';
    let isUnique = false;

    // Keep generating until a unique shortId is found
    while (!isUnique) {
      const generatedId = nanoid(6);
      const existingUrl = await Url.findOne({ shortId: generatedId });

      if (!existingUrl) {
        shortId = generatedId; // unique
        isUnique = true;
      }
    }

    const url = await Url.create({ shortId, longUrl });
    res.status(201).json(url);
  
  } catch (error) {
    res.status(500).json({ message: 'Error creating tinyurl' });
  }
};


export const getUrl = async (req: Request, res: Response): Promise<void> => {
  try {

    const { shortId } = req.query;
    if (!shortId || typeof shortId !== 'string') {
     res.status(400).json({ message: 'shortId query parameter is required' });
     return
    }

    const url = await Url.findOne({ shortId });
    if (!url) {
      res.status(404).json({ message: 'tinyurl not found' });
      return;
    }
    res.status(200).json(url);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tinyurl' });
  }
};
