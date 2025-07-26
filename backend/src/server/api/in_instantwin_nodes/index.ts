import { Router } from 'express';
import getInInstantwinNodes from './get_in_instantwin_nodes_api';
import getInInstantwinNodeById from './get_in_instantwin_node_by_id_api';
import postInInstantwinNode from './post_in_instantwin_node_api';
import putInInstantwinNode from './put_in_instantwin_node_api';
import deleteInInstantwinNode from './delete_in_instantwin_node_api';

const router = Router();

// Node routes
router.get('/in_instantwin_nodes', getInInstantwinNodes);
router.get('/in_instantwin_nodes/:id', getInInstantwinNodeById);
router.post('/in_instantwin_nodes', postInInstantwinNode);
router.put('/in_instantwin_nodes/:id', putInInstantwinNode);
router.delete('/in_instantwin_nodes/:id', deleteInInstantwinNode);

export default router;