import { Button } from "@/components/ui/button"

const StepNav = ({ onNext, canContinue, onPrev }: any) => {
    return (
        <div className="flex justify-between">
            <Button variant="outline" onClick={onPrev}>
                GO BACK
            </Button>
            <Button onClick={onNext} disabled={!canContinue} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
                CONTINUE
            </Button>
        </div>
    )
}

export default StepNav