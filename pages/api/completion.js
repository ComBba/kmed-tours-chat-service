// located at /pages/api/completion.js
import { createCompletion } from '../../lib/openaiHelper';

export default async function handler(req, res) {
  const messages = req.body.messages;
  const response = await createCompletion(messages);
  res.status(200).json({ text: response });
}
