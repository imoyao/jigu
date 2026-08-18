import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * 跨子域 SSO 的 cookie 配置。
 * 把 Supabase session 写到 `.duoduobei.com` 父域（而非默认的子域 localStorage），
 * 这样 jigu.duoduobei.com 与 app.duoduobei.com 共享同一份登录态，实现「任一站登录、另一站免登」。
 * 本地开发（localhost）无法写父域 cookie，回退到默认（当前域）即可，本地 SSO 不生效但功能正常。
 */
const isDev = process.env.NODE_ENV === 'development';
const cookieDomain = process.env.NEXT_PUBLIC_SUPABASE_COOKIE_DOMAIN || '.duoduobei.com';

const authCookieOptions = isDev
  ? undefined
  : {
      domain: cookieDomain,
      path: '/',
      sameSite: 'lax',
      secure: true
    };

const createNoopChannel = () => {
  const channel = {
    on: () => channel,
    subscribe: () => channel
  };
  return channel;
};

const createNoopTable = () => {
  return {
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: null, error: { message: 'Supabase not configured' } })
      })
    }),
    insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    upsert: () => ({
      select: async () => ({ data: null, error: { message: 'Supabase not configured' } })
    })
  };
};

const createNoopSupabase = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    signInWithOtp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithOAuth: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    verifyOtp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: null })
  },
  from: () => createNoopTable(),
  channel: () => createNoopChannel(),
  removeChannel: () => {},
  rpc: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
  functions: {
    invoke: async () => ({ data: null, error: { message: 'Supabase not configured' } })
  }
});

export const supabase = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // 启用自动刷新 token
        autoRefreshToken: true,
        // 持久化 session 到父域 cookie（跨子域 SSO）
        persistSession: true,
        // 检测 URL 中的 session（用于邮箱验证回调）
        detectSessionInUrl: true,
        ...(authCookieOptions ? { cookieOptions: authCookieOptions } : {})
      }
    })
  : createNoopSupabase();
