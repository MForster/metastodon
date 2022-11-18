import { Avatar, Backdrop, Card, CardContent, CardHeader, CardMedia, Link, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { useState } from "react";
import Moment from "react-moment";
import Status from "./Status";
import "./StatusCard.css";

export default function StatusView({ status }: { status: Status }) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const handleBackdropClose = () => setBackdropOpen(false);
  const handleBackdropToggle = () => setBackdropOpen(!backdropOpen);

  return <Card className="status-card" sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
    <Link underline="none" href={status.account.url}>
      <CardHeader
        avatar={<Avatar variant="rounded" src={status.account.avatar} />}
        title={
          status.account.display_name.split(/\s+/).map((s) => {
            for (const emoji of status.account.emojis) {
              if (s == ':' + emoji.shortcode + ':') {
                return <img className="emoji" src={emoji.url} />
              }
            }
            return ' ' + s + ' '
          })
        }
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
