import Response from "@/models/Response";
import Task from "@/models/Task";
import supabase from "@/services/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

interface GetTasksModel {
  subtasks: Task[];
  count: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<GetTasksModel>>
) {
  if (req.method !== "GET") return res.status(405);

  const { taskId, profileId } = req.query;
  if (!taskId || !profileId)
    return res.status(400).json({ success: false, errors: ["Invalid data!"] });

  let {
    data: subtasks,
    count,
    error,
  } = await supabase
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("profileId", profileId)
    .eq("parentTaskId", taskId)
    .order("created_at", { ascending: false });

  if (error || !subtasks) {
    console.log(error);
    res.status(500).json({
      success: false,
      errors: ["Error while fetching subtasks!"],
    });
  }

  res.status(200).json({
    success: true,
    model: { subtasks: subtasks as Task[], count: count ?? 0 },
    errors: [],
  });
}
