const vec2_GRID_START_LOCATION = new THREE.Vector2(190, 980);

class Brick
{
    #m_Mesh;
    #m_BoundingBox;

    #i_Health;
    #vec2_Location
    constructor(m_SceneThreejs, i_Health, vec2_Location) 
    {
        this.#i_Health = i_Health;
        this.#vec2_Location = vec2_Location;
        // Make cuboid
        {
            let m_BoxGeometry = new THREE.BoxGeometry(120, 60, 60);
            let m_Material = get_color_material(get_color_from_health(this.#i_Health));
            this.#m_Mesh = new THREE.Mesh(m_BoxGeometry, m_Material);
            this.#m_Mesh.position.set(vec2_GRID_START_LOCATION.x + vec2_Location.x * 140, vec2_GRID_START_LOCATION.y - this.#vec2_Location.y * 80, 0);
            m_SceneThreejs.add(this.#m_Mesh);

            this.#m_BoundingBox = new THREE.Box3().setFromObject(this.#m_Mesh);
        }
    }

    // Called from Collision.js handle_bricks_collision()
    hit()
    {
        this.#i_Health -= 1;
        this.#m_Mesh.material = get_color_material(get_color_from_health(this.#i_Health));
    }

    // Called from Collision.js handle_bricks_collision()
    get_health()
    {
        return this.#i_Health;
    }

    // Called from Collision.js handle_bricks_collision()
    get_bounding_box()
    {
        return this.#m_BoundingBox;
    }

    // Called from Collision.js handle_bricks_collision()
    destroy(m_SceneThreejs)
    {
        m_SceneThreejs.remove(this.#m_Mesh);
        this.#m_Mesh.geometry.dispose();
        this.#m_Mesh.material.dispose();
        this.#m_Mesh = undefined;
    }
}