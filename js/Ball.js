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

            this.#m_BoundingSphere = new THREE.Sphere(this.#m_Sphere.position, this.#i_Radius);
            this.#m_BoundingBox = new THREE.Box3();
            this.#m_BoundingSphere.getBoundingBox(this.#m_BoundingBox);
        }
        this.reset_location(m_BatBoundingBox);
    }

    // Called from Collision.js handle_bricks_collision()
    bounce_off_brick(m_ObjectCollidedWithBoundingBox)
    {
        let vec3_CollidedObjectLocation = new THREE.Vector3();
        m_ObjectCollidedWithBoundingBox.getCenter(vec3_CollidedObjectLocation);

        let vec3_CollidedObjectSize = new THREE.Vector3();
        m_ObjectCollidedWithBoundingBox.getSize(vec3_CollidedObjectSize);

        if (vec3_CollidedObjectLocation.y - vec3_CollidedObjectSize.y / 2 > this.#m_Sphere.position.y || vec3_CollidedObjectLocation.y + vec3_CollidedObjectSize.y / 2 < this.#m_Sphere.position.y)
        {
            this.#vec3_Velocity.y *= -1;
        }
        else
        {
            this.#vec3_Velocity.x *= -1;
        }
    }

    // Called from Collision.js handle_bricks_collision()
    get_bounding_sphere()
    {
        return this.#m_BoundingSphere;
    }

    // Called from Collision.js handle_bricks_collision()
    get_bounding_box()
    {
        return this.#m_BoundingBox;
    }

    // Called every frame from Game
    update(f_DeltaTime, m_FrameBoundingBoxes, m_BatBoundingBox) 
    {
        // Updates ball location
        {
            if (f_DeltaTime)
            {
                this.#m_Sphere.position.set(
                    this.#m_Sphere.position.x + this.#vec3_Velocity.x * this.#f_Speed * f_DeltaTime,
                    this.#m_Sphere.position.y + this.#vec3_Velocity.y * this.#f_Speed * f_DeltaTime,
                    this.#m_Sphere.position.z + this.#vec3_Velocity.z * this.#f_Speed * f_DeltaTime
                );
            }

            // Updates bounding boxes
            this.#m_BoundingSphere.set(this.#m_Sphere.position, this.#i_Radius);
            this.#m_BoundingSphere.getBoundingBox(this.#m_BoundingBox);
        }

        // Handles collision with walls
        {
            // Left or right walls
            if (does_boundingsphere_collide_with_boundingbox(this.#m_BoundingSphere, this.#m_BoundingBox, m_FrameBoundingBoxes.left) || does_boundingsphere_collide_with_boundingbox(this.#m_BoundingSphere, this.#m_BoundingBox, m_FrameBoundingBoxes.right))
            {
                this.#vec3_Velocity.x *= -1;
            }
            else if (does_boundingsphere_collide_with_boundingbox(this.#m_BoundingSphere, this.#m_BoundingBox, m_FrameBoundingBoxes.ceiling))
            {
                this.#vec3_Velocity.y *= -1;
            }
        }

        // Handles collision with bat
        {
            if (this.#b_Launched && does_boundingsphere_collide_with_boundingbox(this.#m_BoundingSphere, this.#m_BoundingBox, m_BatBoundingBox))
            {
                let vec3_BatSize = new THREE.Vector3();
                m_BatBoundingBox.getSize(vec3_BatSize);

                let vec3_BatLocation = new THREE.Vector3();
                m_BatBoundingBox.getCenter(vec3_BatLocation);
                let f_BallLandingRelativeToBat = this.#m_Sphere.position.x - vec3_BatLocation.x;

                let f_PercentageOfBatBeforeLandingLocation = f_BallLandingRelativeToBat / vec3_BatSize.x;
                let f_AngleToBounceAt = -1 * Math.PI * 0.5 * f_PercentageOfBatBeforeLandingLocation;
                f_AngleToBounceAt += Math.PI * 0.5;
                this.#vec3_Velocity.x = this.#f_Speed * Math.cos(f_AngleToBounceAt);
                this.#vec3_Velocity.y = this.#f_Speed * Math.sin(f_AngleToBounceAt);
            }
        }

    }

    // Called from MainMenuSimulation's update to make bat follow ball
    get_position_vector()
    {
        return this.#m_Sphere.position;
    }

    // Called from Game.update()
    launch_ball()
    {
        this.#b_Launched = true;
        this.#vec3_Velocity.y = this.#f_Speed;

        let f_PercentageOfBatBeforeLandingLocation = Math.random() * 2;
        let f_AngleToBounceAt = -1 * Math.PI * 0.5 * f_PercentageOfBatBeforeLandingLocation;
        this.#vec3_Velocity.x = this.#f_Speed * Math.cos(f_AngleToBounceAt);
        this.#vec3_Velocity.y = this.#f_Speed * Math.sin(f_AngleToBounceAt);
    }

    // Called from Game.update()
    get_ball_launched()
    {
        return this.#b_Launched;
    }

    // Sets location of ball to on top of bat
    reset_location(m_BatBoundingBox)
    {
        // Get bat size
        let vec3_BatSize = new THREE.Vector3();
        m_BatBoundingBox.getSize(vec3_BatSize);

        // Copies bat location
        let vec3_BallLocation = new THREE.Vector3();
        m_BatBoundingBox.getCenter(vec3_BallLocation);

        vec3_BallLocation.y += Math.round(vec3_BatSize.y / 2 + this.#i_Radius);
        this.#m_Sphere.position.set(vec3_BallLocation.x, vec3_BallLocation.y, vec3_BallLocation.z);
        this.#b_Launched = false;
        this.#vec3_Velocity = new THREE.Vector3(0, 0, 0);
    }

    // Called from Game.update()
    check_if_in_frame()
    {
        if (this.#m_Sphere.position.y < 0)
        {
            return false;
        }
        return true;
    }
}