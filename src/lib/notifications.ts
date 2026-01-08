import { supabase } from "@/lib/supabase"

export async function createNotification(
  userId: string,
  title: string,
  message: string
) {
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
  })
}
