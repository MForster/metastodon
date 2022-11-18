export default interface Status {
  account: Account
  content: string
  uri: string
  url: string
  media_attachments: MediaAttachment[]
  created_at: string
}

interface Account {
  acct: string
  display_name: string
  avatar: string
  header: string
  url: string
  emojis: Emoji[]
}

interface Emoji {
  shortcode: string,
  url: string,
}

interface MediaAttachment {
  description: string
  url: string
  preview_url: string
}
