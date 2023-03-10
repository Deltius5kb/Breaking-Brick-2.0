class Bat
{
    #m_Mesh;
    #m_BoundingBox;
    #f_Speed;
    #b_CanMove;

    constructor(m_SceneThreejs)
    {
        this.#f_Speed = 1;
        this.#b_CanMove = false;

        // Cuboid itself
        let m_Geometry = new THREE.BoxGeometry(200, 40, 40);
        let m_Material = new THREE.MeshStandardMaterial({ color: 0x89a9ff });
        this.#m_Mesh = new THREE.Mesh(m_Geometry, m_Material);
        this.#m_Mesh.position.set(960, 200, 0);
        m_SceneThreejs.add(this.#m_Mesh);

        // Bounding box used for colliison
        this.#m_BoundingBox = new THREE.Box3().setFromObject(this.#m_Mesh);
    }

    get_bounding_box() 
    {
        return this.#m_BoundingBox;
    }

    set_can_move(b_NewValue)
    {
        this.#b_CanMove = b_NewValue;
    }

    set_position(vec3_NewPosition)
    {
        this.#m_Mesh.position.x = vec3_NewPosition.x;
    }

    update(f_DeltaTime, m_FrameBoundingBoxes) 
    {
        // Handle player input
        {
            // Move left
            if (KeyStates.a && this.#b_CanMove)
            {
                this.#m_Mesh.translateX(-1 * f_DeltaTime * this.#f_Speed);
            }

            // Move right
            if (KeyStates.d && this.#b_CanMove)
            {
                this.#m_Mesh.translateX(f_DeltaTime * this.#f_Speed);
            }
            // Updates bounding box
            this.#m_BoundingBox.setFromObject(this.#m_Mesh);
        }

        // Handle collision with walls
        {
            // If collides with left wall
            if (do_boundingboxes_collide(this.#m_BoundingBox, m_FrameBoundingBoxes.left))
            {
                let vec3_Wallsize = new THREE.Vector3;
                let vec3_WallCenter = new THREE.Vector3;
                let vec3_Batsize = new THREE.Vector3;
                m_FrameBoundingBoxes.left.getSize(vec3_Wallsize);
                m_FrameBoundingBoxes.left.getCenter(vec3_WallCenter);
                this.#m_BoundingBox.getSize(vec3_Batsize);
                this.#m_Mesh.position.x = Math.round(vec3_WallCenter.x + (vec3_Wallsize.x + vec3_Batsize.x) / 2);
            }

            else if (do_boundingboxes_collide(this.#m_BoundingBox, m_FrameBoundingBoxes.right))
            {
                let vec3_Wallsize = new THREE.Vector3;
                let vec3_WallCenter = new THREE.Vector3;
                let vec3_Batsize = new THREE.Vector3;
                m_FrameBoundingBoxes.right.getSize(vec3_Wallsize);
                m_FrameBoundingBoxes.right.getCenter(vec3_WallCenter);
                this.#m_BoundingBox.getSize(vec3_Batsize);
                this.#m_Mesh.position.x = Math.round(vec3_WallCenter.x - (vec3_Wallsize.x + vec3_Batsize.x) / 2);
            }
        }
    }
}