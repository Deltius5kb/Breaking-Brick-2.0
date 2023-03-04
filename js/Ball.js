class Ball
{
    _m_Sphere;
    _m_BoundingSphere;
    // Used to determine if ball is contained in a box
    _m_BoundingBox;

    #i_Radius;
    _f_Speed;
    _vec3_Velocity;
    _b_Launched;

    constructor(m_SceneThreejs, m_BatBoundingBox)
    {
        this.#i_Radius = 20;
        this._f_Speed = 0.75;
        this._vec3_Velocity = new THREE.Vector3(0, 0, 0);
        this._b_Launched = false;

        // Makes sphere and bounding sphere
        {
            let m_Geometry = new THREE.SphereGeometry(this.#i_Radius);
            let m_Texture = new THREE.MeshStandardMaterial({ color: 0xffffff });
            this._m_Sphere = new THREE.Mesh(m_Geometry, m_Texture)
            m_SceneThreejs.add(this._m_Sphere);

            this._m_BoundingSphere = new THREE.Sphere(this._m_Sphere.position, this.#i_Radius);
            this._m_BoundingBox = new THREE.Box3();
            this._m_BoundingSphere.getBoundingBox(this._m_BoundingBox);
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

        if (vec3_CollidedObjectLocation.y - vec3_CollidedObjectSize.y / 2 > this._m_Sphere.position.y || vec3_CollidedObjectLocation.y + vec3_CollidedObjectSize.y / 2 < this._m_Sphere.position.y)
        {
            this._vec3_Velocity.y *= -1;
        }
        else
        {
            this._vec3_Velocity.x *= -1;
        }
    }

    // Called from Collision.js handle_bricks_collision()
    get_bounding_sphere()
    {
        return this._m_BoundingSphere;
    }

    // Called from Collision.js handle_bricks_collision()
    get_bounding_box()
    {
        return this._m_BoundingBox;
    }

    // Called every frame from Game
    update(f_DeltaTime, m_FrameBoundingBoxes, m_BatBoundingBox) 
    {
        // Updates ball location
        {
            if (f_DeltaTime)
            {
                this._m_Sphere.position.set(
                    this._m_Sphere.position.x + this._vec3_Velocity.x * this._f_Speed * f_DeltaTime,
                    this._m_Sphere.position.y + this._vec3_Velocity.y * this._f_Speed * f_DeltaTime,
                    this._m_Sphere.position.z + this._vec3_Velocity.z * this._f_Speed * f_DeltaTime
                );
            }

            // Updates bounding boxes
            this._m_BoundingSphere.set(this._m_Sphere.position, this.#i_Radius);
            this._m_BoundingSphere.getBoundingBox(this._m_BoundingBox);
        }

        // Handles collision with walls
        {
            // Left or right walls
            if (does_boundingsphere_collide_with_boundingbox(this._m_BoundingSphere, this._m_BoundingBox, m_FrameBoundingBoxes.left) || does_boundingsphere_collide_with_boundingbox(this._m_BoundingSphere, this._m_BoundingBox, m_FrameBoundingBoxes.right))
            {
                this._vec3_Velocity.x *= -1;
            }
            else if (does_boundingsphere_collide_with_boundingbox(this._m_BoundingSphere, this._m_BoundingBox, m_FrameBoundingBoxes.ceiling))
            {
                this._vec3_Velocity.y *= -1;
            }
        }

        this._handle_collision_with_bat(m_BatBoundingBox);
    }

    // Called from update
    // Overridden in SimulationBall class 
    _handle_collision_with_bat(m_BatBoundingBox)
    {
        if (this._b_Launched && does_boundingsphere_collide_with_boundingbox(this._m_BoundingSphere, this._m_BoundingBox, m_BatBoundingBox))
        {
            let vec3_BatSize = new THREE.Vector3();
            m_BatBoundingBox.getSize(vec3_BatSize);

            let vec3_BatLocation = new THREE.Vector3();
            m_BatBoundingBox.getCenter(vec3_BatLocation);
            let f_BallLandingRelativeToBat = this._m_Sphere.position.x - vec3_BatLocation.x;

            let f_PercentageOfBatBeforeLandingLocation = f_BallLandingRelativeToBat / vec3_BatSize.x;
            let f_AngleToBounceAt = -1 * Math.PI * 0.5 * f_PercentageOfBatBeforeLandingLocation;
            f_AngleToBounceAt += Math.PI * 0.5;
            this._vec3_Velocity.x = this._f_Speed * Math.cos(f_AngleToBounceAt);
            this._vec3_Velocity.y = this._f_Speed * Math.sin(f_AngleToBounceAt);
        }
    }

    // Called from MainMenuSimulation's update to make bat follow ball
    get_position_vector()
    {
        return this._m_Sphere.position;
    }

    // Called from Game.update()
    launch_ball()
    {
        this._b_Launched = true;
        this._vec3_Velocity.y = this._f_Speed;
    }

    // Called from Game.update()
    get_ball_launched()
    {
        return this._b_Launched;
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
        this._m_Sphere.position.set(vec3_BallLocation.x, vec3_BallLocation.y, vec3_BallLocation.z);
        this._b_Launched = false;
        this._vec3_Velocity = new THREE.Vector3(0, 0, 0);
    }

    // Called from Game.update()
    check_if_in_frame()
    {
        if (this._m_Sphere.position.y < 0)
        {
            return false;
        }
        return true;
    }
}

class SimulationBall extends Ball
{
    constructor(m_SceneThreejs, m_BatBoundingBox)
    {
        super(m_SceneThreejs, m_BatBoundingBox);
    }

    _handle_collision_with_bat(m_BatBoundingBox)
    {
        if (this._b_Launched && does_boundingsphere_collide_with_boundingbox(this._m_BoundingSphere, this._m_BoundingBox, m_BatBoundingBox))
        {
            this._vec3_Velocity.y *= -1;
        }
    }

    launch_ball()
    {
        this._b_Launched = true;
        this._vec3_Velocity.y = this._f_Speed;

        let f_PercentageOfBatBeforeLandingLocation = Math.random() * 2;
        let f_AngleToBounceAt = -1 * Math.PI * 0.5 * f_PercentageOfBatBeforeLandingLocation;
        this._vec3_Velocity.x = this._f_Speed * Math.cos(f_AngleToBounceAt);
        this._vec3_Velocity.y = this._f_Speed * Math.sin(f_AngleToBounceAt);
    }
}