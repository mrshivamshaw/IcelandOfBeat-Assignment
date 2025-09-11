import { useDateRanges, usePricingRules } from "../../hooks/useAdmin"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Calendar, DollarSign } from "lucide-react"

export default function AdminPricing() {
    const { data: dateRanges, isLoading: loadingRanges } = useDateRanges()
    const { data: pricingRules, isLoading: loadingRules } = usePricingRules()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add Date Range
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Add Pricing Rule
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Date Ranges */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                            Date Ranges
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingRanges ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-16 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dateRanges?.map((range: any) => (
                                    <div key={range._id} className="p-3 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{range.name}</h4>
                                            <Badge variant={range.isActive ? "default" : "secondary"}>
                                                {range.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {new Date(range.startDate).toLocaleDateString()} - {new Date(range.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pricing Rules */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <DollarSign className="h-5 w-5 mr-2 text-teal-600" />
                            Pricing Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingRules ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-12 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {pricingRules?.map((rule: any) => (
                                    <div key={rule._id} className="p-3 border rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge variant="outline" className="capitalize">
                                                {rule.itemType}
                                            </Badge>
                                            <span className="font-medium">${(rule.basePrice / 100).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{rule.dateRangeId?.name || "Unknown Range"}</p>
                                        {rule.perPersonPrice > 0 && (
                                            <p className="text-xs text-gray-500">
                                                + ${(rule.perPersonPrice / 100).toLocaleString()} per person
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
