import { Avatar, Backdrop, Card, CardContent, CardHeader, CardMedia, Link, Typography } from "@mui/material"
import DOMPurify from "dompurify"
import { useState } from "react"
import Moment from "react-moment"
import Status, { Account } from "./Status"
import "./StatusCard.css"

function DisplayName({ account }: { account: Account }): JSX.Element {
  return <>
    {account.display_name.split(/\s+/).map((s) => {
      for (const emoji of account.emojis) {
        if (s == ':' + emoji.shortcode + ':') {
          return <><img className="emoji" src={emoji.url} /> {' '}</>
        }
      }
      return s + ' '
    })}</>
}


export default function StatusCard({ status }: { status: Status }) {
  const [backdropOpen, setBackdropOpen] = useState(false)
  const handleBackdropClose = () => setBackdropOpen(false)
  const handleBackdropToggle = () => setBackdropOpen(!backdropOpen)

  if (status.reblog) {
    return <>
      <Typography variant="body2" sx={{ maxWidth: 600, mx: 'auto', mb: 1 }}>
        <Link underline="none" href={status.account.url}><DisplayName account={status.account} /></Link> boosted:
      </Typography>
      <StatusCard status={status.reblog} />
    </>
  }

  return <Card className="status-card" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
    <Link underline="none" href={status.account.url}>
      <CardHeader
        avatar={<Avatar variant="rounded" src={status.account.avatar} />}
        title={<DisplayName account={status.account} />}
        subheader={status.account.acct}
        action={
          <Link underline="none" href={status.url}>
            <Typography variant="caption" color="text.secondary">
              <Moment fromNow={true}>{status.created_at}</Moment>
            </Typography>
          </Link>
        }
      />
    </Link>

    {!!status.media_attachments.length &&
      <>
        <CardMedia
          component="img"
          height="200"
          image={status.media_attachments[0].preview_url}
          alt={status.media_attachments[0].description}
          onClick={handleBackdropToggle}
        />
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={backdropOpen} onClick={handleBackdropClose}>
          <img src={status.media_attachments[0].url} />
        </Backdrop>
      </>
    }

    <CardContent>
      <Typography dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(status.content) }} />
    </CardContent>
  </Card >
}
