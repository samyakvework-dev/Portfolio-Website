import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProjects, createProject, updateProject, deleteProject, reorderProjects } from './_lib/store.js';
import { extractToken, verifySessionToken } from './_lib/auth.js';
import { parseRequestBody, sendResponse } from './_lib/apiHandler.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return sendResponse(res, 204);
  }

  const token = extractToken(req);
  const session = verifySessionToken(token);
  const isAdmin = session.valid;

  try {
    const urlObj = new URL(req.url || '/', 'http://localhost');
    const query = Object.fromEntries(urlObj.searchParams.entries());

    // ------------------------------------------------------------------------
    // GET: Retrieve projects
    // ------------------------------------------------------------------------
    if (req.method === 'GET') {
      const includeDrafts = isAdmin && (query.all === 'true' || query.drafts === 'true');
      const projects = await getProjects(includeDrafts);
      return sendResponse(res, 200, { success: true, projects, isAdmin });
    }

    // All mutating operations below require admin authorization
    if (!isAdmin) {
      return sendResponse(res, 401, { success: false, error: 'Unauthorized. Admin login required.' });
    }

    const body = await parseRequestBody(req);

    // ------------------------------------------------------------------------
    // POST: Create new project
    // ------------------------------------------------------------------------
    if (req.method === 'POST') {
      if (!body.title) {
        return sendResponse(res, 400, { success: false, error: 'Project title is required.' });
      }
      const newProject = await createProject(body);
      return sendResponse(res, 201, { success: true, project: newProject });
    }

    // ------------------------------------------------------------------------
    // PUT: Update project
    // ------------------------------------------------------------------------
    if (req.method === 'PUT') {
      const id = query.id || body.id;
      if (!id) {
        return sendResponse(res, 400, { success: false, error: 'Project ID is required for update.' });
      }
      const updated = await updateProject(id, body);
      if (!updated) {
        return sendResponse(res, 404, { success: false, error: 'Project not found.' });
      }
      return sendResponse(res, 200, { success: true, project: updated });
    }

    // ------------------------------------------------------------------------
    // DELETE: Delete project
    // ------------------------------------------------------------------------
    if (req.method === 'DELETE') {
      const id = query.id || body.id;
      if (!id) {
        return sendResponse(res, 400, { success: false, error: 'Project ID is required for deletion.' });
      }
      const deleted = await deleteProject(id);
      if (!deleted) {
        return sendResponse(res, 404, { success: false, error: 'Project not found.' });
      }
      return sendResponse(res, 200, { success: true, message: 'Project deleted successfully.' });
    }

    // ------------------------------------------------------------------------
    // PATCH: Reorder projects
    // ------------------------------------------------------------------------
    if (req.method === 'PATCH') {
      if (Array.isArray(body.orderedIds)) {
        const reordered = await reorderProjects(body.orderedIds);
        return sendResponse(res, 200, { success: true, projects: reordered });
      }
      return sendResponse(res, 400, { success: false, error: 'orderedIds array required for reordering.' });
    }

    return sendResponse(res, 405, { success: false, error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('[Projects API Error]', err);
    return sendResponse(res, 500, { success: false, error: err.message || 'Internal server error.' });
  }
}
