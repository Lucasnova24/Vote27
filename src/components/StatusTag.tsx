import type { CandidateStatus } from '../types'

export default function StatusTag({ status }: { status: CandidateStatus }) {
  const declared = status === 'déclaré'
  return (
    <span className="tag" style={{ background: declared ? '#DDF3E3' : '#EFEBE2', color: declared ? '#14532D' : '#454A66' }}>
      {status}
    </span>
  )
}
