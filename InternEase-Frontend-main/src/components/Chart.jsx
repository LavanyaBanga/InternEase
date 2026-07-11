import React, { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

const Chart = ({ type = 'bar', data, config, height, ...props }) => {
  const colors = ['#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4', '#FEE440']
  const isMobile = useIsMobile()

  const tickStyle = { fontSize: isMobile ? 10 : 12 }
  const chartHeight = height || (isMobile ? 240 : 300)
  const chartMargin = isMobile
    ? { top: 8, right: 8, left: 0, bottom: 8 }
    : { top: 8, right: 16, left: 8, bottom: 8 }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={chartMargin} {...props}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xKey}
              tick={tickStyle}
              interval={isMobile ? 'preserveStartEnd' : 0}
              angle={isMobile ? -35 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 50 : 30}
            />
            <YAxis tick={tickStyle} width={isMobile ? 32 : 40} />
            <Tooltip wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
            <Bar dataKey={config.yKey} fill={colors[0]} />
          </BarChart>
        )
      
      case 'line':
        return (
          <LineChart data={data} margin={chartMargin} {...props}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xKey}
              tick={tickStyle}
              interval={isMobile ? 'preserveStartEnd' : 0}
              angle={isMobile ? -35 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 50 : 30}
            />
            <YAxis tick={tickStyle} width={isMobile ? 32 : 40} />
            <Tooltip wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
            <Line type="monotone" dataKey={config.yKey} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        )
      
      case 'pie':
        return (
          <PieChart margin={chartMargin} {...props}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                isMobile ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={isMobile ? 70 : 90}
              fill="#8884d8"
              dataKey={config.yKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} />
          </PieChart>
        )
      
      default:
        return null
    }
  }
  
  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      {renderChart()}
    </ResponsiveContainer>
  )
}

export default Chart