class Game
{
    #m_SceneThreejs;
    #m_CameraThreejs;
    #m_PointLightThreejs;
    #m_AmbientLightThreejs;
    #m_HTMLCanvas;
    #m_RendererThreejs;

    #m_Frame;
    #m_FrameBoundingBoxes;

    #m_Bat;
    #m_Ball;

    #a_BrickObjects;
    #a_FallingPowerups;

    #i_ActiveLevel;
    #i_Score;
    #i_Lives;
    #f_Timer;
    #b_TimerRunning;

    constructor()
    {
        this.#i_Score = 0;
        this.#i_Lives = 3;
        this.#a_FallingPowerups = [];
        this.#i_ActiveLevel;
        update_lives_div(this.#i_Lives);

        this.#f_Timer = 0;
        this.#b_TimerRunning = false;

        // Setup scene object
        this.#m_SceneThreejs = new THREE.Scene();

        // Setup renderer
        {
            this.#m_HTMLCanvas = document.getElementById("game-canvas");
            this.#m_RendererThreejs = new THREE.WebGLRenderer({ canvas: this.#m_HTMLCanvas });
            document.body.appendChild(this.#m_RendererThreejs.domElement);
            this.#m_HTMLCanvas.width = window.innerWidth;
            this.#m_HTMLCanvas.height = window.innerHeight;
            this.#m_RendererThreejs.setSize(this.#m_HTMLCanvas.width, this.#m_HTMLCanvas.height);
        }

        // Setup camera
        {
            let i_Width = 1920;
            let i_Dist = 1100;
            let f_Aspect = 1920 / 1080;
            let f_Fov = 2 * Math.atan((i_Width / f_Aspect) / (2 * i_Dist)) * (180 / Math.PI) + 7;

            this.#m_CameraThreejs = new THREE.PerspectiveCamera(f_Fov, window.innerWidth / window.innerHeight, 0.1, 10000);
            let vec3_CameraPosition = new THREE.Vector3(960, 620, i_Dist - 200);
            this.#m_CameraThreejs.position.set(vec3_CameraPosition.x, vec3_CameraPosition.y, vec3_CameraPosition.z);
        }

        // Lighting
        {
            this.#m_PointLightThreejs = new THREE.PointLight(0xbbbbbb);
            this.#m_PointLightThreejs.position.set(this.#m_CameraThreejs.position.x, this.#m_CameraThreejs.position.y, this.#m_CameraThreejs.position.z + 5);
            this.#m_AmbientLightThreejs = new THREE.AmbientLight(0x909090);
            this.#m_SceneThreejs.add(this.#m_PointLightThreejs, this.#m_AmbientLightThreejs);
        }

        // Frame
        {
            let m_Material = new THREE.MeshStandardMaterial({ color: 0x1a2749 });
            let m_BackgroundMaterial = new THREE.MeshStandardMaterial({ color: 0x0e1734 });

            let m_CeilingGeometry = new THREE.BoxGeometry(1920, 100, 60);
            let m_SideGeometry = new THREE.BoxGeometry(200, 1080, 60);
            let m_BackgroundGeometry = new THREE.BoxGeometry(1920, 1080, 100);

            // Make frame object
            this.#m_Frame = {
                ceiling: new THREE.Mesh(m_CeilingGeometry, m_Material),
                left: new THREE.Mesh(m_SideGeometry, m_Material),
                right: new THREE.Mesh(m_SideGeometry, m_Material),
                background: new THREE.Mesh(m_BackgroundGeometry, m_BackgroundMaterial)
            };

            // Set frame locations
            this.#m_Frame.ceiling.position.set(960, 1080, 0);
            this.#m_Frame.left.position.set(0, 590, 0);
            this.#m_Frame.right.position.set(1920, 590, 0);
            this.#m_Frame.background.position.set(960, 590, -90);

            // Set frame bounding boxes
            this.#m_FrameBoundingBoxes = {
                ceiling: new THREE.Box3().setFromObject(this.#m_Frame.ceiling),
                left: new THREE.Box3().setFromObject(this.#m_Frame.left),
                right: new THREE.Box3().setFromObject(this.#m_Frame.right),
                // Background has no bounding box
            }

            // Adds frame to scene
            this.#m_SceneThreejs.add(this.#m_Frame.ceiling, this.#m_Frame.left, this.#m_Frame.right, this.#m_Frame.background);
        }

        this.#a_BrickObjects = [];
        // // Makes array of bricks
        // for (let row = 0; row < 5; row++)
        // {
        //     for (let column = 0; column < 12; column++)
        //     {
        //         let m_Brick = new Brick(this.#m_SceneThreejs, 1, new THREE.Vector2(column, row));
        //         this.#a_BrickObjects.push(m_Brick);
        //     }
        // }

        // Make other objects
        this.#m_Bat = new Bat(this.#m_SceneThreejs);
        this.#m_Ball = new Ball(this.#m_SceneThreejs, this.#m_Bat.get_bounding_box());
    }

    update(f_DeltaTime)
    {
        this.#m_Bat.update(f_DeltaTime, this.#m_FrameBoundingBoxes);
        this.#m_Ball.update(f_DeltaTime, this.#m_FrameBoundingBoxes, this.#m_Bat.get_bounding_box());
        this.#handle_inputs();
        this.#handle_collisions();

        for (let i = 0; i < this.#a_FallingPowerups.length; i++)
        {
            this.#a_FallingPowerups[i].update(f_DeltaTime);
        }

        // If ball is out of frame 
        if (!this.#m_Ball.check_if_in_frame())
        {
            // Update lives
            this.#i_Lives -= 1;
            update_lives_div(this.#i_Lives);

            this.#m_Ball.reset_location(this.#m_Bat.get_bounding_box());
            this.#m_Bat.set_can_move(false);
            this.#b_TimerRunning = false;
        }

        if (this.#b_TimerRunning)
        {
            this.#f_Timer += f_DeltaTime;
            update_timer_div(this.#f_Timer);
        }
    }

    check_if_level_completed()
    {
        if (this.#a_BrickObjects.length == 0)
        {
            return true;
        }

        for (let i = 0; i < this.#a_BrickObjects.length; i++)
        {
            if (this.#a_BrickObjects[i].i_Health > 0) 
            {
                return true;
            }
        }
        return false;
    }

    get_score()
    {
        return this.#i_Score;
    }

    get_active_level()
    {
        return this.#i_ActiveLevel;
    }

    set_level_array(a_NewBricks, i_Level)
    {
        this.#i_ActiveLevel = i_Level;

        // Empties array of bricks and removes them from the scene
        for (let i = 0; i < this.#a_BrickObjects.length; i++)
        {
            this.#a_BrickObjects[i].destroy(this.#m_SceneThreejs);
        }

        this.#a_BrickObjects = [];

        for (let i = 0; i < a_NewBricks.length; i++)
        {
            let m_Brick = new Brick(this.#m_SceneThreejs, a_NewBricks[i].i_Health, a_NewBricks[i].vec2_GridLocation);
            this.#a_BrickObjects.push(m_Brick);
        }
    }

    draw() 
    {
        this.#m_RendererThreejs.render(this.#m_SceneThreejs, this.#m_CameraThreejs);
    }

    #handle_inputs()
    {
        // Handles inputs
        {
            if (KeyStates.space && !this.#m_Ball.get_ball_launched())
            {
                this.#m_Ball.launch_ball();
                this.#m_Bat.set_can_move(true);
                this.#b_TimerRunning = true;
            }
        }
    }

    #handle_collisions()
    {
        let m_BoundingSphere = this.#m_Ball.get_bounding_sphere();
        let m_SphereBoundingBox = this.#m_Ball.get_bounding_box();

        // Check each brick for collision with ball
        for (let index = 0; index < this.#a_BrickObjects.length; index++) 
        {
            let m_BrickBoundingBox = this.#a_BrickObjects[index].get_bounding_box();
            if (does_boundingsphere_collide_with_boundingbox(m_BoundingSphere, m_SphereBoundingBox, m_BrickBoundingBox))
            {
                // Make ball bounce off the brick
                this.#m_Ball.bounce_off_brick(this.#a_BrickObjects[index].get_bounding_box());

                // Apply damage
                this.#a_BrickObjects[index].hit();
                // If brick is destroyed
                if (this.#a_BrickObjects[index].get_health() == 0)
                {
                    // Given chance, spawns a powerup
                    let f_SpawnChance = 1;
                    if (Math.random() < f_SpawnChance)
                    {
                        // Make powerup spawn
                        let vec3_CollidedBrickLocation = new THREE.Vector3();
                        this.#a_BrickObjects[index].get_bounding_box().getCenter(vec3_CollidedBrickLocation);
                        let m_ThisPowerup = new Powerup(this.#m_SceneThreejs, vec3_CollidedBrickLocation, false);
                        this.#a_FallingPowerups.push(m_ThisPowerup);
                    }

                    // Destroy brick
                    this.#i_Score += this.#a_BrickObjects[index].destroy(this.#m_SceneThreejs);
                    this.#a_BrickObjects.splice(index, 1);
                    update_score_div(this.#i_Score);
                    return;
                }
            }
        }
    }
}