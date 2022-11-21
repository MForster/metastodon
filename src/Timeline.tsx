import { useEffect, useState } from 'react'
import Instance from './Instance'
import Status from './Status'
import StatusCard from './StatusCard'

export default function Timeline({ instance }: { instance: Instance }) {
  const [statuses, setStatuses] = useState<Status[]>([])

  useEffect(() => {
    instance?.get('api/v1/timelines/home').then(setStatuses)
  }, [])

  return <>{
    statuses.map(status => <StatusCard key={status.uri} status={status} />)
  }</>
}
