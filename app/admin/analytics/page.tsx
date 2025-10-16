"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  BarChart3
} from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>
  revenueByPlatform: Array<{ platform: string; revenue: number; orders: number }>
  revenueByService: Array<{ service: string; revenue: number; orders: number }>
  recentTrends: {
    revenueGrowth: number
    ordersGrowth: number
    customersGrowth: number
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6months")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const supabase = createClient()
      
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      
      switch (timeRange) {
        case "1month":
          startDate.setMonth(endDate.getMonth() - 1)
          break
        case "3months":
          startDate.setMonth(endDate.getMonth() - 3)
          break
        case "6months":
          startDate.setMonth(endDate.getMonth() - 6)
          break
        case "1year":
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
        default:
          startDate.setMonth(endDate.getMonth() - 6)
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return
      }

      if (orders) {
        const analyticsData = calculateAnalytics(orders, startDate, endDate)
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAnalytics = (orders: any[], startDate: Date, endDate: Date): AnalyticsData => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.package_price), 0)
    const totalOrders = orders.length
    const uniqueEmails = new Set(orders.map(order => order.email))
    const totalCustomers = uniqueEmails.size
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Revenue by month
    const monthlyData = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(order => {
      const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { revenue: 0, orders: 0 })
      }
      const data = monthlyData.get(month)!
      data.revenue += Number(order.package_price)
      data.orders += 1
    })

    const revenueByMonth = Array.from(monthlyData.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    // Revenue by platform
    const platformData = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(order => {
      if (!platformData.has(order.platform)) {
        platformData.set(order.platform, { revenue: 0, orders: 0 })
      }
      const data = platformData.get(order.platform)!
      data.revenue += Number(order.package_price)
      data.orders += 1
    })

    const revenueByPlatform = Array.from(platformData.entries())
      .map(([platform, data]) => ({ platform, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    // Revenue by service
    const serviceData = new Map<string, { revenue: number; orders: number }>()
    orders.forEach(order => {
      if (!serviceData.has(order.service_type)) {
        serviceData.set(order.service_type, { revenue: 0, orders: 0 })
      }
      const data = serviceData.get(order.service_type)!
      data.revenue += Number(order.package_price)
      data.orders += 1
    })

    const revenueByService = Array.from(serviceData.entries())
      .map(([service, data]) => ({ service, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    // Calculate trends (compare first half vs second half of period)
    const midDate = new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) / 2)
    const firstHalf = orders.filter(order => new Date(order.created_at) < midDate)
    const secondHalf = orders.filter(order => new Date(order.created_at) >= midDate)

    const firstHalfRevenue = firstHalf.reduce((sum, order) => sum + Number(order.package_price), 0)
    const secondHalfRevenue = secondHalf.reduce((sum, order) => sum + Number(order.package_price), 0)
    const revenueGrowth = firstHalfRevenue > 0 ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 : 0

    const ordersGrowth = firstHalf.length > 0 ? ((secondHalf.length - firstHalf.length) / firstHalf.length) * 100 : 0

    const firstHalfCustomers = new Set(firstHalf.map(order => order.email)).size
    const secondHalfCustomers = new Set(secondHalf.map(order => order.email)).size
    const customersGrowth = firstHalfCustomers > 0 ? ((secondHalfCustomers - firstHalfCustomers) / firstHalfCustomers) * 100 : 0

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      revenueByMonth,
      revenueByPlatform,
      revenueByService,
      recentTrends: {
        revenueGrowth,
        ordersGrowth,
        customersGrowth
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toFixed(2)}`
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.totalRevenue)}</dd>
                  <dd className={`text-sm ${analytics.recentTrends.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center">
                      {analytics.recentTrends.revenueGrowth >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {formatPercentage(analytics.recentTrends.revenueGrowth)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalOrders}</dd>
                  <dd className={`text-sm ${analytics.recentTrends.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center">
                      {analytics.recentTrends.ordersGrowth >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {formatPercentage(analytics.recentTrends.ordersGrowth)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalCustomers}</dd>
                  <dd className={`text-sm ${analytics.recentTrends.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center">
                      {analytics.recentTrends.customersGrowth >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {formatPercentage(analytics.recentTrends.customersGrowth)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(analytics.averageOrderValue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Platform */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Platform</h3>
          <div className="space-y-4">
            {analytics.revenueByPlatform.map((item) => (
              <div key={item.platform} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">{item.platform}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
                  <div className="text-xs text-gray-500">{item.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Service */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Service</h3>
          <div className="space-y-4">
            {analytics.revenueByService.map((item) => (
              <div key={item.service} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">{item.service}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
                  <div className="text-xs text-gray-500">{item.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
        <div className="space-y-4">
          {analytics.revenueByMonth.map((item) => (
            <div key={item.month} className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-900">{item.month}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
                <div className="text-xs text-gray-500">{item.orders} orders</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
