import { ChangeEvent } from 'react';
import { JobType, ExperienceLevel } from '../../types/job';

interface SearchFiltersProps {
  filters: {
    search: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    salaryRange: string;
  };
  onFilterChange: (filters: any) => void;
}

const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship'];
const experienceLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'lead'];
const salaryRanges = [
  { value: '0-50000', label: 'Up to $50,000' },
  { value: '50000-100000', label: '$50,000 - $100,000' },
  { value: '100000-150000', label: '$100,000 - $150,000' },
  { value: '150000+', label: '$150,000+' },
];

const SearchFilters = ({ filters, onFilterChange }: SearchFiltersProps) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search
        </label>
        <input
          type="text"
          name="search"
          id="search"
          value={filters.search}
          onChange={handleChange}
          className="input mt-1"
          placeholder="Job title or keywords"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          value={filters.location}
          onChange={handleChange}
          className="input mt-1"
          placeholder="City or remote"
        />
      </div>

      <div>
        <label
          htmlFor="jobType"
          className="block text-sm font-medium text-gray-700"
        >
          Job Type
        </label>
        <select
          name="jobType"
          id="jobType"
          value={filters.jobType}
          onChange={handleChange}
          className="input mt-1"
        >
          <option value="">All Types</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="experienceLevel"
          className="block text-sm font-medium text-gray-700"
        >
          Experience Level
        </label>
        <select
          name="experienceLevel"
          id="experienceLevel"
          value={filters.experienceLevel}
          onChange={handleChange}
          className="input mt-1"
        >
          <option value="">All Levels</option>
          {experienceLevels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="salaryRange"
          className="block text-sm font-medium text-gray-700"
        >
          Salary Range
        </label>
        <select
          name="salaryRange"
          id="salaryRange"
          value={filters.salaryRange}
          onChange={handleChange}
          className="input mt-1"
        >
          <option value="">All Ranges</option>
          {salaryRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() =>
          onFilterChange({
            search: '',
            location: '',
            jobType: '',
            experienceLevel: '',
            salaryRange: '',
          })
        }
        className="btn btn-secondary w-full"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SearchFilters; 