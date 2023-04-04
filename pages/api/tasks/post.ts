import Response from "@/models/Response";
import Task, { CreateTask } from "@/models/Task";
import supabase from "@/services/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: CreateTask;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Response<Task[]>>
) {
  if (req.method !== "POST") return res.status(405);

  const newTask = req.body;
  if (!newTask)
    return res.status(400).json({ success: false, errors: ["Invalid data!"] });

  const { data, error } = await supabase.from("tasks").insert(newTask).select();
  if (error)
    return res
      .status(500)
      .json({ success: false, errors: ["Error inserting task!"] });

  res.status(200).json({ success: true, errors: [], model: data as Task[] });
}
