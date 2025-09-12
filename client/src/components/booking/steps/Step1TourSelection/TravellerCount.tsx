import { Button } from '@/components/ui/button'
import { Label } from '@radix-ui/react-label'
import { Minus, Plus } from 'lucide-react'

const TravellerCount = ({label, type, updateTravelers, isDisabled,count}: any) => {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
                <Label className="font-medium">{label}</Label>
            </div>
            <div className="flex items-center space-x-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTravelers(type, -1)}
                    disabled={isDisabled}
                    className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{count}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTravelers(type, 1)}
                    className="h-8 w-8 p-0 rounded-full border-teal-300 text-teal-600 hover:bg-teal-50"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default TravellerCount