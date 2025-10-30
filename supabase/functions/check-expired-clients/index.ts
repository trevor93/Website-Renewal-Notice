import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const { data: expiredClients, error: selectError } = await supabase
      .from("clients")
      .select("*")
      .eq("payment_status", "paid")
      .eq("manual_override", false)
      .not("payment_date", "is", null)
      .lt("payment_date", thirtyDaysAgoStr);

    if (selectError) {
      throw selectError;
    }

    if (!expiredClients || expiredClients.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No expired clients found",
          checked: new Date().toISOString(),
          deactivated: 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const clientIds = expiredClients.map(c => c.id);

    const { error: updateError } = await supabase
      .from("clients")
      .update({
        payment_status: "unpaid",
        site_active: false
      })
      .in("id", clientIds);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Deactivated ${expiredClients.length} expired client(s)`,
        checked: new Date().toISOString(),
        deactivated: expiredClients.length,
        clients: expiredClients.map(c => ({
          site_name: c.site_name,
          domain_name: c.domain_name,
          payment_date: c.payment_date
        }))
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});