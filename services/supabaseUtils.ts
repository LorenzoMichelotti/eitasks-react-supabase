import Profile from "@/models/Profile";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";

export async function getProfileData(
  user: User,
  supabase: SupabaseClient<any, "public", any>,
  loadProfile: (profile: Profile) => void
) {
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", user?.email);

  if (error) {
    console.log(error);
    return;
  }

  if (profile && profile.length <= 0) {
    toast.loading("No profile found... creating new profile", {
      id: "profile-data",
    });
    const { message, success } = await createProfileData(user, supabase);
    if (!success) toast.error(message, { id: "profile-data" });
    else toast.success(message, { id: "profile-data" });
  }

  const newProfile: Profile = profile?.shift() as Profile;
  loadProfile(newProfile);
  return newProfile;
}

export async function createProfileData(
  user: User,
  supabase: SupabaseClient<any, "public", any>
) {
  const { error } = await supabase
    .from("profiles")
    .insert([{ email: user?.email }]);
  if (error) {
    return {
      message: "error while creating profile data",
      success: false,
      error,
    };
  }
  return {
    message: "successfully created profile data",
    success: true,
    error,
  };
}
