'use client';

import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();
  const projectId = Number(id);

  return <h2>{projectId}</h2>;
}
