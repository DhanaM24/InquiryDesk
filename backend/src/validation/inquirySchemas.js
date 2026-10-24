const { z } = require('zod');

exports.createInquiry = z.object({
  customerName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  contact: z.string().trim().min(5, 'Contact must be at least 5 characters').max(150),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(150),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
});

exports.changeStatus = z.object({
  status: z.enum(['new', 'in_progress', 'resolved']),
  version: z.number().int().positive(),
});
