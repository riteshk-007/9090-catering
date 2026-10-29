import { ProcessSteps } from '@/components/common/process-steps'

const steps = [
  {
    title: 'Share your plans',
    text: 'Tell us the occasion, date, guest numbers and location through our simple enquiry form.',
  },
  {
    title: 'Get a proposal',
    text: 'We suggest a menu and style of service shaped around your event and any dietary needs.',
  },
  {
    title: 'Refine together',
    text: 'Adjust dishes and details until everything feels right. We confirm your quote with you directly.',
  },
  {
    title: 'Relax and enjoy',
    text: 'We prepare, present and serve the food, so you can enjoy the occasion with your guests.',
  },
]

export function HomeProcess() {
  return (
    <ProcessSteps
      eyebrow="How it works"
      title={
        <>
          Planning made <em className="font-normal text-gold-deep">simple.</em>
        </>
      }
      intro="Four easy steps from first enquiry to the final course."
      steps={steps}
      tone="light"
    />
  )
}
