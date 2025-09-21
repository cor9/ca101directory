import MailerLite from 'mailerlite';

// Initialize MailerLite only if API key is available
let mailerLite: MailerLite | null = null;

const hasMailerLiteConfig = process.env.MAILERLITE_API_KEY;

if (hasMailerLiteConfig) {
  try {
    mailerLite = new MailerLite({
      api_key: process.env.MAILERLITE_API_KEY,
    });
    console.log('✅ MailerLite initialized successfully');
  } catch (error) {
    console.warn('❌ MailerLite initialization failed:', error);
  }
} else {
  console.warn('⚠️ MailerLite not configured - missing API key');
}

export interface SubscriberData {
  email: string;
  name?: string;
  fields?: Record<string, any>;
}

export async function addSubscriberToMailerLite(data: SubscriberData): Promise<{ success: boolean; error?: string }> {
  if (!mailerLite) {
    console.warn('MailerLite not initialized - cannot add subscriber');
    return { success: false, error: 'MailerLite not configured' };
  }

  try {
    // Get the default group (or you can specify a group ID)
    const groups = await mailerLite.groups.get();
    const defaultGroup = groups.data?.[0];
    
    if (!defaultGroup) {
      return { success: false, error: 'No groups found in MailerLite' };
    }

    // Add subscriber to the group
    const subscriber = await mailerLite.subscribers.create({
      email: data.email,
      name: data.name || '',
      groups: [defaultGroup.id],
      fields: data.fields || {},
    });

    console.log('✅ Subscriber added to MailerLite:', subscriber);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error adding subscriber to MailerLite:', error);
    
    // Handle specific MailerLite errors
    if (error.response?.data?.error?.message) {
      return { success: false, error: error.response.data.error.message };
    }
    
    return { success: false, error: 'Failed to add subscriber' };
  }
}

export { mailerLite };
