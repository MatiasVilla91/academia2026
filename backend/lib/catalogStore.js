import mongoose from 'mongoose';
import { buildCourseCatalog } from '../scripts/buildCourseCatalog.js';

let cachedCourses = null;

function ensureCourses() {
  if (!cachedCourses) {
    cachedCourses = buildCourseCatalog().map((course, index) => ({
      ...course,
      _id: course.hotmartId || course.slug || `local-${index + 1}`,
      clickCount: course.clickCount || 0,
      createdAt: course.createdAt || new Date().toISOString(),
      updatedAt: course.updatedAt || new Date().toISOString(),
    }));
  }
  return cachedCourses;
}

export function hasMongoConnection() {
  return mongoose.connection.readyState === 1;
}

export function getLocalCourses() {
  return ensureCourses();
}

export function getLocalCourseBySlug(slug) {
  return ensureCourses().find((course) => course.slug === slug && course.active);
}

export function incrementLocalClick(hotmartId) {
  const course = ensureCourses().find((item) => item.hotmartId === hotmartId);
  if (!course) return null;
  course.clickCount += 1;
  return course;
}

export function getLocalCategories() {
  const counts = new Map();
  for (const course of ensureCourses()) {
    if (!course.active) continue;
    counts.set(course.category, (counts.get(course.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
