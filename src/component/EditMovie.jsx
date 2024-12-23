import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditMovie = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [videoType, setVideoType] = useState('LINK');
  const [videoUrl, setVideoUrl] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [status, setStatus] = useState('PENDING'); // New status state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://ottb.leadgenadvertisements.com/api/category/v1/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        setCategories(response.data.data);
      } catch (error) {
        setCategories([]);
      }
    };

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://ottb.leadgenadvertisements.com/api/movie/v1/movie/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        const movie = response.data.data;
        setName(movie.name);
        setDescription(movie.description);
        setCategoryId(movie.categoryId);
        setVideoType(movie.videoType);
        setVideoUrl(movie.videoUrl || '');
        setStatus(movie.status || 'PENDING'); // Set status from fetched data
      } catch (error) {
      }
    };

    fetchCategories();
    fetchMovieDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) formData.append('image', image);
    formData.append('videoType', videoType);
    formData.append('categoryId', categoryId);
    formData.append('status', status); // Include status in form data

    if (videoType === 'UPLOAD' && video) {
      formData.append('movie', video);
    } else if (videoType === 'LINK') {
      formData.append('videoUrl', videoUrl);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(`https://ottb.leadgenadvertisements.com/api/movie/v1/movie/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Movie updated successfully!');
      setError('');
    } catch (error) {
      setError('Failed to update movie. Please try again later.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-4">Edit Movie</h1>
        {success && <div className="text-green-500 mb-4">{success}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Existing form fields */}
          <div className="mb-3">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Image File:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Category ID:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name} ({category._id})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-gray-700">Video Type:</label>
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="LINK">Link</option>
              <option value="UPLOAD">Upload</option>
            </select>
          </div>
          {videoType === 'LINK' && (
            <div className="mb-3">
              <label className="block text-gray-700">Video URL:</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
          {videoType === 'UPLOAD' && (
            <div className="mb-3">
              <label className="block text-gray-700">Video File:</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
          <div className="mb-3">
            <label className="block text-gray-700">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="PENDING">Pending</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
          <button
            type="submit"
            className={`w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Movie'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMovie;
