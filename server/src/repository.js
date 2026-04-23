import { FeedbackModel } from './models/Feedback.js';
import { fileStore, usingMongo } from './config/db.js';
import mongoose from 'mongoose';

function isMongo() {
  return mongoose.connection.readyState === 1;
}

function newId() {
  return 'AIBH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export const repo = {
  async create(payload) {
    const doc = {
      ...payload,
      submissionId: newId(),
      date: payload.date ? new Date(payload.date) : new Date(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    if (isMongo()) {
      const saved = await FeedbackModel.create(doc);
      return saved.toObject();
    }
    fileStore.insert(doc);
    return doc;
  },

  async list({ from, to, company } = {}) {
    let rows;
    if (isMongo()) {
      const q = {};
      if (from || to) q.date = {};
      if (from) q.date.$gte = new Date(from);
      if (to) q.date.$lte = new Date(to);
      if (company) q.companyName = new RegExp(company, 'i');
      rows = (await FeedbackModel.find(q).sort({ date: -1 }).lean()).map(normalize);
    } else {
      rows = fileStore.all().map(normalize);
      if (from) rows = rows.filter((r) => new Date(r.date) >= new Date(from));
      if (to) rows = rows.filter((r) => new Date(r.date) <= new Date(to));
      if (company) rows = rows.filter((r) => r.companyName?.toLowerCase().includes(company.toLowerCase()));
      rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return rows;
  },

  async findBySubmissionId(id) {
    if (isMongo()) {
      const doc = await FeedbackModel.findOne({ submissionId: id }).lean();
      return doc ? normalize(doc) : null;
    }
    return fileStore.all().find((r) => r.submissionId === id) || null;
  },

  async count() {
    if (isMongo()) return FeedbackModel.countDocuments();
    return fileStore.all().length;
  },

  async replaceAll(rows) {
    if (isMongo()) {
      await FeedbackModel.deleteMany({});
      await FeedbackModel.insertMany(rows);
    } else {
      fileStore.replace(rows);
    }
  },
};

function normalize(d) {
  const { _id, __v, ...rest } = d;
  return rest;
}
