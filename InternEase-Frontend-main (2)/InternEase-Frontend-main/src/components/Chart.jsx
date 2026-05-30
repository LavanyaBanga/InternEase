import React from 'react'
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

const Chart = ({ type = 'bar', data, config, ...props }) => {
  const colors = ['#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4', '#FEE440']
  
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} {...props}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={config.yKey} fill={colors[0]} />
          </BarChart>
        )
      
      case 'line':
        return (
          <LineChart data={data} {...props}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={config.yKey} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        )
      
      case 'pie':
        return (
          <PieChart {...props}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={config.yKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
      
      default:
        return null
    }
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      {renderChart()}
    </ResponsiveContainer>
  )
}

export default Chart