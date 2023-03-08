import Response from "@/models/Response";
import Task from "@/models/Task";
import supabase from "@/services/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<Task>>
) {
  if (req.method !== "DELETE") return res.status(405);

  const { taskId } = req.query;
  if (!taskId)
    return res
      .status(400)
      .json({ success: false, errors: ["Error deleting task!"] });

  const _taskId: string = taskId as string;

  const { error } = await supabase.from("tasks").delete().eq("id", _taskId);
  if (error)
    return res
      .status(400)
      .json({ success: false, errors: ["Error deleting task!"] });

  res.status(200).json({ success: true, errors: [] });
}
