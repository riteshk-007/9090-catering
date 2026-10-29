import { Faq } from '@/components/common/faq'

const items = [
  {
    question: 'What kinds of events do you cater?',
    answer:
      'Weddings and celebrations, corporate events such as meetings and launches, and private gatherings like dinner parties and family occasions. If your event is different, just ask.',
  },
  {
    question: 'Can I choose my own menu?',
    answer:
      'Yes. Our menu is a starting point. We adapt dishes, portions and presentation to your event, and we are happy to include your favourite dishes.',
  },
  {
    question: 'Do you cater for dietary needs?',
    answer:
      'Yes. Please tell us about vegetarian, vegan, gluten-free, dairy-free or allergy needs when you enquire, and we will build them into the menu.',
  },
  {
    question: 'How do I get a quote?',
    answer:
      'Send us a short enquiry with your date, number of guests, location and the kind of event. We will reply with a menu proposal and a clear quote, and confirm availability with you directly.',
  },
]

export function HomeFaq() {
  return (
    <Faq
      eyebrow="Questions"
      title={
        <>
          Good to <em className="font-normal text-champagne">know.</em>
        </>
      }
      intro="Quick answers to the questions we hear most often."
      items={items}
    />
  )
}
