import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import JobCard from '../components/jobs/JobCard';
import SearchFilters from '../components/jobs/SearchFilters';
import { Job } from '../types/job';

const Home = () => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: '',
  });

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const { data } = await axios.get('/api/jobs', { params: filters });
      return data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900">Find your dream job</h1>
        <p className="mt-2 text-lg text-gray-600">
          Search through thousands of job listings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white rounded-lg shadow p-6"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : jobs?.length ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 
 