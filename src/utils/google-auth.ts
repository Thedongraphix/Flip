import { supabase } from './supabase';

export const signInWithGoogle = async (redirectTo: string = window.location.origin) => {
    try {
      console.log("Starting Google sign-in process");
      console.log("Redirect URL:", `${redirectTo}/auth/callback`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectTo}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
  
      if (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
      
      console.log("Google sign-in data:", data);
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };
  
/**
 * Handle the OAuth callback from Google
 * 
 * @returns The user session, or null if there's no session
 */
export const handleOAuthCallback = async () => {
  try {
    // Get the session from the URL
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session;
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    throw error;
  }
};

/**
 * Check if a profile exists for the authenticated user
 * If not, create one using the user metadata
 * 
 * @param userId The user ID
 * @param userMetadata The user metadata from Google
 */
export const ensureUserProfile = async (userId: string, userMetadata: any) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      throw fetchError;
    }
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            first_name: userMetadata.given_name || '',
            last_name: userMetadata.family_name || '',
            email: userMetadata.email,
            account_type: 'individual',
            kyc_status: 'not_started',
            created_at: new Date().toISOString(),
          },
        ]);
      
      if (insertError) {
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
};