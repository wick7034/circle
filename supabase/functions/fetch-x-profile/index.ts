import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface XProfileData {
  username: string;
  profile_image_url: string;
  name: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const cleanUsername = username.replace("@", "");

    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=profile_image_url,name`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("TWITTER_BEARER_TOKEN")}`,
        },
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          profile_image_url: `https://ui-avatars.com/api/?name=${cleanUsername}&background=random`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data: { data: XProfileData } = await response.json();

    return new Response(
      JSON.stringify({
        profile_image_url: data.data.profile_image_url || `https://ui-avatars.com/api/?name=${cleanUsername}&background=random`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const username = (await req.json().catch(() => ({})))?.username || "user";
    return new Response(
      JSON.stringify({
        profile_image_url: `https://ui-avatars.com/api/?name=${username}&background=random`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
