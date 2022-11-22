import { Avatar, Backdrop, Card, CardContent, CardHeader, CardMedia, Link, Typography } from "@mui/material"
import DOMPurify from "dompurify"
import { useState } from "react"
import Moment from "react-moment"
import Status, { Account } from "./Status"
import "./StatusCard.css"

function DisplayName({ account }: { account: Account }): JSX.Element {
  let remaining = account.display_name
  let segments = []
  while (true) {
    const match = /^(|.*?\s)(:\w+:)(|\s.*?)$/.exec(remaining)
    if (match) {
      segments.push(match[1])
      segments.push(match[2])
      remaining = match[3]
    } else {
      if (remaining.length)
        segments.push(remaining)
      break
    }
  }
  return <>{segments.map((s, i) => {
    for (const emoji of account.emojis) {
      if (s == ':' + emoji.shortcode + ':') {
        return <img key={i} className="emoji" src={emoji.url} />
      }
    }
    return <span key={i}>{s}</span>
  })}</>
}


export default function StatusCard({ status, selected }: { status: Status, selected: boolean }) {
  const [backdropOpen, setBackdropOpen] = useState(false)
  const handleBackdropClose = () => setBackdropOpen(false)
  const handleBackdropToggle = () => setBackdropOpen(!backdropOpen)

  if (status.reblog) {
    return <>
      <Typography variant="body2" sx={{ maxWidth: 600, mx: 'auto', mb: 1 }}>
        <Link underline="none" href={status.account.url}><DisplayName account={status.account} /></Link> boosted:
      </Typography>
      <StatusCard status={status.reblog} selected={selected} />
    </>
  }

  return <Card raised={selected} className="status-card" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
    <CardHeader
      avatar={<Link underline="none" href={status.account.url}>
        <Avatar variant="rounded" src={status.account.avatar} />
      </Link>}
      title={<Link underline="none" href={status.account.url}>
        <DisplayName account={status.account} />
      </Link>}
      subheader={status.account.acct}
      action={
        <Link underline="none" href={status.url}>
          <Typography variant="caption" color="text.secondary">
            <Moment fromNow={true}>{status.created_at}</Moment>
          </Typography>
        </Link>
      }
    />

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
          <img className="media" src={status.media_attachments[0].url} />
        </Backdrop>
      </>
    }

    <CardContent>
      <Typography dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(status.content) }} />
    </CardContent>
  </Card >
}
