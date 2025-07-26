import { Router } from 'express';
import { getInInstantwinEdgesApi } from './get_in_instantwin_edges_api';
import { getInInstantwinEdgeByIdApi } from './get_in_instantwin_edge_by_id_api';
import { postInInstantwinEdgeApi } from './post_in_instantwin_edge_api';
import { putInInstantwinEdgeApi } from './put_in_instantwin_edge_api';
import { deleteInInstantwinEdgeApi } from './delete_in_instantwin_edge_api';

const router = Router();

// GET /api/in_instantwin_edges - Get all edges
router.get('/in_instantwin_edges', getInInstantwinEdgesApi);

// GET /api/in_instantwin_edges/:id - Get edge by ID
router.get('/in_instantwin_edges/:id', getInInstantwinEdgeByIdApi);

// POST /api/in_instantwin_edges - Create new edge
router.post('/in_instantwin_edges', postInInstantwinEdgeApi);

// PUT /api/in_instantwin_edges/:id - Update edge
router.put('/in_instantwin_edges/:id', putInInstantwinEdgeApi);

// DELETE /api/in_instantwin_edges/:id - Delete edge
router.delete('/in_instantwin_edges/:id', deleteInInstantwinEdgeApi);

export default router;