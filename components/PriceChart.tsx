import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const dummyData = [
  { date: '4/1', price: 18000 },
  { date: '4/2', price: 17500 },
  { date: '4/3', price: 18200 },
]

export default function PriceChart({ productId }: { productId: string }) {
  return (
    <div className="w-full h-64 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dummyData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#0070f3" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}