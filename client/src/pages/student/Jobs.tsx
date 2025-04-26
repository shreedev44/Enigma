import Breadcrumbs from '@/components/Breadcrumbs'
import { studentRoutes } from '@/constants/routeUrl'
import React from 'react'

const Jobs = () => {
  return (
    <div className='pt-24'>
      <Breadcrumbs
        components={[{ component: "Jobs", path: studentRoutes.JOBS }]}
      />
      <section>
        <div className='md:px-20 px-5 md:my-10 my-4'>
            <p className='font-mono font-bold text-lg md:text-4xl'>Find your perfect job, at the perfect place</p>
            
        </div>
      </section>

    </div>
  )
}

export default Jobs
