import React from 'react'
import Hero from '../components/Hero'
// import { Calendar } from 'lucide-react'
// import ResearchAssistant from './ResearchAssistant'
// import Summarize from './Summarize'
// import EmailReplies from './EmailReplies'
import FeaturedSection from './Featured';



const Home = () => {
  return (
    <div>
        <Hero />
        {/* <EmailReplies/>
        <Calendar/>
        <Summarize/>
        <ResearchAssistant/> */}
        < FeaturedSection/>
    </div>
  )
}

export default Home