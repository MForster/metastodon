import { LinearProgress } from '@mui/material'
import Instance from './Instance'
import StatusCard from './StatusCard'

export default function Timeline({ instance }: { instance: Instance }) {
  const { data, error } = instance.useTimeline('home')

  return error ? <>{error.toString()}</> :
    data ? <>{data.map(status => <StatusCard key={status.uri} status={status} />)}</> :
      <LinearProgress />
}
