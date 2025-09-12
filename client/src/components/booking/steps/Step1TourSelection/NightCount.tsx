import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'


const NightCount = ({isDisabled, updateExtraNights, type, count}: {isDisabled: boolean, updateExtraNights: any, type: "before" | "after", count: number}) => {
    return (
        <div className="flex items-center justify-center space-x-3">
            <Button
                variant="outline"
                size="sm"
                onClick={() => updateExtraNights(type, -1)}
                disabled={isDisabled}
                className="h-8 w-8 p-0 rounded-full"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <span className="w-16 text-center">
                <strong>{count}</strong> nights
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => updateExtraNights(type, 1)}
                className="h-8 w-8 p-0 rounded-full"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default NightCount