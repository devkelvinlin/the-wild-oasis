import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://mlbdgvqecxxyjfjfuzri.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYmRndnFlY3h4eWpmamZ1enJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyMTI5MjIsImV4cCI6MjAzODc4ODkyMn0.bx5nHibI7S2yyOUdS4uA1WFJU1TLA2z7w4hX_yeen_U";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
