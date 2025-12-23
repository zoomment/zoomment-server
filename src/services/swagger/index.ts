import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zoomment API',
      version: '1.0.0',
      description: 'Open Source Self-Hosted Comment System API',
      contact: {
        name: 'Tigran Simonyan'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        tokenAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'token',
          description: 'JWT token for authenticated users'
        },
        fingerprintAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'fingerprint',
          description: 'Browser fingerprint for anonymous tracking'
        }
      },
      schemas: {
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            author: { type: 'string', example: 'John Doe' },
            body: { type: 'string', example: 'This is a great post!' },
            gravatar: { type: 'string', example: 'd4c74594d841139328695756648b6bd6' },
            isVerified: { type: 'boolean', example: true },
            isOwn: { type: 'boolean', example: false },
            parentId: { type: 'string', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time' },
            repliesCount: { type: 'number', example: 5 }
          }
        },
        CommentInput: {
          type: 'object',
          required: ['email', 'author', 'body', 'pageUrl', 'pageId'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            author: { type: 'string', example: 'John Doe' },
            body: { type: 'string', example: 'This is my comment' },
            pageUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/post/1'
            },
            pageId: { type: 'string', example: 'example.com/post/1' },
            parentId: { type: 'string', description: 'Parent comment ID for replies' }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 42 },
            limit: { type: 'number', example: 10 },
            skip: { type: 'number', example: 0 },
            hasMore: { type: 'boolean', example: true }
          }
        },
        Vote: {
          type: 'object',
          properties: {
            commentId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            upvotes: { type: 'number', example: 10 },
            downvotes: { type: 'number', example: 2 },
            score: { type: 'number', example: 8 },
            userVote: { type: 'number', enum: [-1, 0, 1], example: 1 }
          }
        },
        VoteInput: {
          type: 'object',
          required: ['commentId', 'value'],
          properties: {
            commentId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            value: {
              type: 'number',
              enum: [1, -1],
              description: '1 = upvote, -1 = downvote'
            }
          }
        },
        Reaction: {
          type: 'object',
          properties: {
            aggregation: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string', example: '👍' },
                  count: { type: 'number', example: 15 }
                }
              }
            },
            userReaction: {
              type: 'object',
              nullable: true,
              properties: {
                reaction: { type: 'string', example: '👍' }
              }
            }
          }
        },
        Site: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            domain: { type: 'string', example: 'example.com' },
            verified: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'user@example.com' }
          }
        },
        Visitor: {
          type: 'object',
          properties: {
            pageId: { type: 'string', example: 'example.com/post/1' },
            count: { type: 'number', example: 150 }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' }
          }
        }
      }
    },
    paths: {
      // Comments
      '/comments': {
        get: {
          tags: ['Comments'],
          summary: 'Get comments for a page',
          parameters: [
            {
              name: 'pageId',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Page identifier'
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'number', default: 10 },
              description: 'Number of comments to return'
            },
            {
              name: 'skip',
              in: 'query',
              schema: { type: 'number', default: 0 },
              description: 'Number of comments to skip'
            }
          ],
          responses: {
            200: {
              description: 'List of comments',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      comments: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Comment' }
                      },
                      total: { type: 'number' },
                      limit: { type: 'number' },
                      skip: { type: 'number' },
                      hasMore: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Comments'],
          summary: 'Add a new comment',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommentInput' }
              }
            }
          },
          responses: {
            200: { description: 'Comment created successfully' },
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } }
              }
            }
          }
        }
      },
      '/comments/{id}': {
        delete: {
          tags: ['Comments'],
          summary: 'Delete a comment',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            {
              name: 'secret',
              in: 'query',
              schema: { type: 'string' },
              description: 'Secret token for anonymous deletion'
            }
          ],
          security: [{ tokenAuth: [] }],
          responses: {
            200: { description: 'Comment deleted' },
            403: { description: 'Forbidden' },
            404: { description: 'Comment not found' }
          }
        }
      },
      '/comments/{commentId}/replies': {
        get: {
          tags: ['Comments'],
          summary: 'Get replies for a comment',
          parameters: [
            { name: 'commentId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'number', default: 10 } },
            { name: 'skip', in: 'query', schema: { type: 'number', default: 0 } }
          ],
          responses: {
            200: {
              description: 'List of replies',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      replies: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Comment' }
                      },
                      total: { type: 'number' },
                      limit: { type: 'number' },
                      skip: { type: 'number' },
                      hasMore: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // Votes
      '/votes': {
        post: {
          tags: ['Votes'],
          summary: 'Vote on a comment',
          security: [{ fingerprintAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VoteInput' }
              }
            }
          },
          responses: {
            200: {
              description: 'Vote recorded',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Vote' } }
              }
            },
            400: { description: 'Validation error' }
          }
        },
        get: {
          tags: ['Votes'],
          summary: 'Get votes for multiple comments',
          security: [{ fingerprintAuth: [] }],
          parameters: [
            {
              name: 'commentIds',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Comma-separated comment IDs'
            }
          ],
          responses: {
            200: { description: 'Vote counts per comment' }
          }
        }
      },
      '/votes/{commentId}': {
        get: {
          tags: ['Votes'],
          summary: 'Get votes for a single comment',
          security: [{ fingerprintAuth: [] }],
          parameters: [
            { name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Vote counts',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Vote' } }
              }
            }
          }
        }
      },

      // Reactions
      '/reactions': {
        post: {
          tags: ['Reactions'],
          summary: 'Add or toggle a reaction',
          security: [{ fingerprintAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['pageId', 'reaction'],
                  properties: {
                    pageId: { type: 'string', example: 'example.com/post/1' },
                    reaction: { type: 'string', example: '👍' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Reaction recorded',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Reaction' } }
              }
            }
          }
        },
        get: {
          tags: ['Reactions'],
          summary: 'Get reactions for a page',
          security: [{ fingerprintAuth: [] }],
          parameters: [
            { name: 'pageId', in: 'query', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Reaction counts',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Reaction' } }
              }
            }
          }
        }
      },

      // Visitors
      '/visitors': {
        post: {
          tags: ['Visitors'],
          summary: 'Track a page visitor',
          security: [{ fingerprintAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['pageId'],
                  properties: {
                    pageId: { type: 'string', example: 'example.com/post/1' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Visitor tracked',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Visitor' } }
              }
            }
          }
        },
        get: {
          tags: ['Visitors'],
          summary: 'Get visitor count for a page',
          parameters: [
            { name: 'pageId', in: 'query', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Visitor count',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Visitor' } }
              }
            }
          }
        }
      },
      '/visitors/domain': {
        get: {
          tags: ['Visitors'],
          summary: 'Get visitor stats for a domain',
          parameters: [
            { name: 'domain', in: 'query', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Domain visitor stats',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      domain: { type: 'string' },
                      count: { type: 'number' },
                      uniquePages: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // Users
      '/users/auth': {
        post: {
          tags: ['Users'],
          summary: 'Request magic link login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Magic link sent' }
          }
        }
      },
      '/users/profile': {
        get: {
          tags: ['Users'],
          summary: 'Get current user profile',
          security: [{ tokenAuth: [] }],
          responses: {
            200: {
              description: 'User profile',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } }
              }
            }
          }
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user account',
          security: [{ tokenAuth: [] }],
          responses: {
            200: { description: 'Account deleted' }
          }
        }
      },

      // Sites
      '/sites': {
        get: {
          tags: ['Sites'],
          summary: 'Get user sites',
          security: [{ tokenAuth: [] }],
          responses: {
            200: {
              description: 'List of sites',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Site' } }
                }
              }
            }
          }
        },
        post: {
          tags: ['Sites'],
          summary: 'Add a new site',
          security: [{ tokenAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['url'],
                  properties: {
                    url: { type: 'string', format: 'uri', example: 'https://example.com' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Site added',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Site' } }
              }
            }
          }
        }
      },
      '/sites/{id}': {
        delete: {
          tags: ['Sites'],
          summary: 'Delete a site',
          security: [{ tokenAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Site deleted' },
            404: { description: 'Site not found' }
          }
        }
      }
    }
  },
  apis: []
};

export const swaggerSpec = swaggerJsdoc(options);
