class Ball
{
    #m_Sphere;
    #m_BoundingSphere;
    // Used to determine if ball is contained in a box
    #m_BoundingBox;

    #i_Radius;
    #f_Speed;
    #vec3_Velocity;
    #b_Launched;

    constructor(m_SceneThreejs, m_BatBoundingBox)
    {
        this.#i_Radius = 20;
        this.#f_Speed = 0.75;
        this.#vec3_Velocity = new THREE.Vector3(0, 0, 0);
        this.#b_Launched = false;

        // Makes sphere and bounding sphere
        {
            let m_Geometry = new THREE.SphereGeometry(this.#i_Radius);
            let m_Texture = new THREE.MeshStandardMaterial({ color: 0xffffff });
            this.#m_Sphere = new THREE.Mesh(m_Geometry, m_Texture)
            m_SceneThreejs.add(this.#m_Sphere);

            this.#m_BoundingSphere = new THREE.Sphere(new THREE.Vector3(), this.#i_Radius);
            this.#m_BoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            this.#m_BoundingSphere.getBoundingBox(this.#m_BoundingBox);
        }
        this.ResetLocation(m_BatBoundingBox);
    }

    update(f_DeltaTime) 
    {
        // Handles inputs 
        {
            if (KeyStates.space && !this.#b_Launched) {
                this.#b_Launched = true;
                this.#vec3_Velocity.y = this.#f_Speed;
            }
        }

        // Updates ball location
        {
            if (f_DeltaTime) {
                this.#m_Sphere.position.set(
                    this.#m_Sphere.position.x + this.#vec3_Velocity.x * this.#f_Speed * f_DeltaTime,
                    this.#m_Sphere.position.y + this.#vec3_Velocity.y * this.#f_Speed * f_DeltaTime,
                    this.#m_Sphere.position.z + this.#vec3_Velocity.z * this.#f_Speed * f_DeltaTime
                );
            }
        }
    }

    // Sets location of ball to on top of bat
    ResetLocation(m_BatBoundingBox)
    {
        // Get bat size
        let vec3_BatSize = new THREE.Vector3();
        m_BatBoundingBox.getSize(vec3_BatSize);

        // Copies bat location
        let vec3_BallLocation = new THREE.Vector3();
        m_BatBoundingBox.getCenter(vec3_BallLocation);

        vec3_BallLocation.y += Math.round(vec3_BatSize.y / 2 + this.#i_Radius);
        this.#m_Sphere.position.set(vec3_BallLocation.x, vec3_BallLocation.y, vec3_BallLocation.z);
    }
}