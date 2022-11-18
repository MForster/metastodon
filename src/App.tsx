import { useEffect, useState } from 'react';
import Status from './Status';
import PostView from './StatusCard';

export default function App() {
  let [timeline, setTimeline] = useState<Status[]>([]);

  useEffect(() => {
    fetch("https://mas.to/api/v1/timelines/public")
      .then((response) => response.json())
      .then(setTimeline);
  }, [])

  return <> {
    timeline.map((status) =>
      <PostView key={status.uri} status={status} />)
  } </>
}
